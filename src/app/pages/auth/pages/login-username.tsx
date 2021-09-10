import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { TextField } from '@material-ui/core';
import * as auth from '../_redux/auth-redux';
// eslint-disable-next-line no-restricted-imports
import { makeStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Error';
import { GenerateKeyPair, SignMessage, SymmetricDecrypt } from "../service/auth-cryptography";
import { CERTIFICATE_EXP } from "../../../common-library/common-consts/enviroment";
import { GetCredential } from '../_redux/auth.service';

/*
  INTL (i18n) docs:
  https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage
*/

/*
  Formik+YUP:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
*/

const initialValues = {
  username: '',
  password: 'admin',
};

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      backgroundColor: 'white',
    },
  },
}));

const LoginUsername = (props: { saveUserInfo?: any; intl?: any; location?: any; savePingErrorData?: any; }) => {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { search } = window.location;
  let callbackUrl = new URLSearchParams(search).get('callbackUrl');

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      // .matches(/^\S*$/, intl.formatMessage({
      //   id: 'ERROR.SPACE_NOT_ALLOWED',
      // }),)
      .required(
        intl.formatMessage({
          id: 'AUTH.VALIDATION.REQUIRED_FIELD',
        }),
      ),
    password: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      // .matches(/^\S*$/, intl.formatMessage({
      //   id: 'ERROR.SPACE_NOT_ALLOWED',
      // }),)
      .required(
        intl.formatMessage({
          id: 'AUTH.VALIDATION.REQUIRED_FIELD',
        }),
      ),
  });

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const submitUsername =
    ({ username }: { username: string }, { setStatus, setSubmitting }: { setStatus: any; setSubmitting: any }) => {
      setLoading(true);
      setTimeout(() => {
        GetCredential(username)
          .then(response => {
            const {
              username,
            }: {
              encryptedPrivateKey: string;
              publicKey: string;
              username: string;
            } = response.data;
            const fullName = (response.data.username) ?? '';
            const id = response.data.id ?? '';
            localStorage.setItem('userInfo', JSON.stringify({ username, fullName, id }));
            props.saveUserInfo({
              ...response.data,
              fullName,
            });
            history.push('/auth/login/challenge?callbackUrl=' + callbackUrl);
          })
          .catch(err => {
            setLoading(false);
            setSubmitting(false);
            setStatus(intl.formatMessage({ id: 'AUTH.VALIDATION.INVALID_USERNAME' }),
            );
          });
      }, 200);
    };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: submitUsername,
  });
  const errorMessage = new URLSearchParams(search).get('errorMessage');

  useEffect(() => {
    if (errorMessage && errorMessage != 'null' && errorMessage != 'undefined') {
      formik.setStatus(intl.formatMessage({ id: errorMessage }));
    }
  }, [errorMessage]);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  return (
    <div
      className="login-form login-signin p-5"
      id="kt_login_signin_form"
      style={{ zIndex: 1 }}
    >
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-10">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.LOGIN.TITLE" />
        </h3>
        <p className="text-muted font-weight-bold">
          <FormattedMessage id="AUTH.LOGIN.INPUT_NAME.PLACE_HOLDER" />
        </p>
      </div>
      {/* end::Head */}

      {/*begin::Form*/}
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework">
        <div className="form-group fv-plugins-icon-container">
          <TextField
            id="outlined-basic"
            autoFocus
            className={`form-control form-control-solid h-auto`}
            label={(<FormattedMessage id="AUTH.LOGIN.USER_NAME" />)}
            variant="outlined"
            {...formik.getFieldProps('username')}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="fv-plugins-message-container mt-4">
              <div className="fv-help-block">{formik.errors.username}</div>
            </div>
          ) : null}
          {formik.status && <div className="mt-4 text-danger font-weight-bold"><ErrorIcon /> {formik.status}</div>}
        </div>
        <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
          <Link tabIndex={-1}
            to="/auth/forgot-password"
            className="text-dark-50 text-hover-primary my-3 mr-2"
            id="kt_login_forgot">
            <p className="text-muted font-weight-bold" />
          </Link>
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={formik.isSubmitting}
            style={{ zIndex: 1 }}
            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}>
            <span><FormattedMessage id="AUTH.LOGIN.NEXT_BTN" /></span>
            {loading && <span className="ml-3 spinner spinner-white" />}
          </button>
          <Link tabIndex={-1}
            to="/auth/forgot-password"
            className="text-dark-50 text-hover-primary my-3 mr-2"
            id="kt_login_forgot">
            <p className="text-muted font-weight-bold" />
          </Link>
        </div>
      </form>
      {/*end::Form*/}
    </div>
  );
};

export default injectIntl(connect(null, auth.actions)(LoginUsername));
