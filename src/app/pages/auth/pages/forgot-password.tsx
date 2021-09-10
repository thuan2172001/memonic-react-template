import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import { FormattedMessage, injectIntl } from 'react-intl';
import * as auth from '../_redux/auth-redux';
import { requestPassword } from '../_redux/auth.service';
import { TextField } from '@material-ui/core';
import { formatMessage } from '@formatjs/intl';

const initialValues = {
  email: '',
};

function ForgotPassword(props: { intl: any }) {
  const { intl } = props;
  const [isRequested, setIsRequested] = useState(false);
  const [countTime, setCountTime] = useState<number>(0);

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Wrong email format')
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required(
        intl.formatMessage({
          id: 'AUTH.VALIDATION.REQUIRED_FIELD',
        }),
      ),
  });

  useEffect(() => {
    if (countTime > 0) {
      setTimeout(() => {
        setCountTime(countTime - 1);
      }, 1000);
    }
  }, [countTime]);

  // const getInputClasses = fieldname => {
  //   if (formik.touched[fieldname] && formik.errors[fieldname]) {
  //     return 'is-invalid';
  //   }

  //   if (formik.touched[fieldname] && !formik.errors[fieldname]) {
  //     return 'is-valid';
  //   }

  //   return '';
  // };

  const formik = useFormik({
    initialValues,
    validationSchema: ForgotPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setCountTime(60)
      requestPassword(values.email)
        .then(() => {
          setIsRequested(true);
        })
        .catch(() => {
          // setIsRequested(false);
          setSubmitting(false);
          setStatus(
            intl.formatMessage({ id: 'AUTH.VALIDATION.NOT_FOUND' }, { name: values.email }),
          );
        });
    },
  });

  return (
    <>
      {/* {isRequested && <Redirect to="/auth" />} */}
      {/* {!isRequested && ( */}
      <div className="login-form login-forgot" style={{ display: 'block', zIndex: 1 }}>
        <div className="mb-lg-10">
          <h3 className="font-size-h1 mb-10 text-center"><FormattedMessage id={'AUTH.FORGOT_PASSWORD_QUESTION'} /></h3>
          <div className="font-weight-bold">
            <FormattedMessage id={'AUTH.FORGOT_PASSWORD_MSG1'} />
            <br />
            <FormattedMessage id={'AUTH.FORGOT_PASSWORD_MSG2'} />
            <br />
            <FormattedMessage id={'AUTH.FORGOT_PASSWORD_MSG3'} />
          </div>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp">
          {formik.status && (
            <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
              <div className="alert-text font-weight-bold">{formik.status}</div>
            </div>
          )}
          <div className="form-group fv-plugins-icon-container">
            {/* <input
                type="email"
                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                  'email',
                )}`}
                name="email"
                {...formik.getFieldProps('email')}
              /> */}
            <TextField
              id="outlined-basic"
              autoFocus
              className={`form-control form-control-solid h-auto`}
              label={intl.formatMessage({ id: 'USER.MASTER.TABLE.MAIL' })}
              placeholder={intl.formatMessage({ id: 'AUTH.FORGOT_PASSWORD_EMAIL_PLACEHOLDER' })}
              variant="outlined"
              // name="username"
              // onClick={() => alert('cc')}

              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.email}</div>
              </div>
            ) : null}
          </div>
          <div className="form-group d-flex flex-wrap flex-center" style={{ zIndex: 1 }}>
            <button
              id="kt_login_forgot_submit"
              type="submit"
              className={`btn ${countTime <= 0 ? "btn-primary" : "btn-secondary"} font-weight-bold px-9 py-4 my-3 mx-4`}
              disabled={countTime > 0}>
              {countTime > 0 ? <span className="text-danger">{countTime}</span> :
                <FormattedMessage id={isRequested ? 'COMMON.BTN_RESEND' : 'COMMON.BTN_SUBMIT'} />}
            </button>
            <Link to="/auth/login/identifier">
              <button
                type="button"
                id="kt_login_forgot_cancel"
                className="btn btn-outline-primary font-weight-bold px-9 py-4 my-3 mx-4">
                <FormattedMessage id={'COMMON.BTN_CANCEL'} />
              </button>
            </Link>
          </div>
        </form>
      </div>
      {/* )} */}
    </>
  );
}

export default injectIntl(connect(null, auth.actions)(ForgotPassword));
