import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { dangerIconStyle, DefaultPagination, HomePageURL, iconStyle, NormalColumn, primaryIconStyle, SortColumn, successIconStyle } from '../../common-library/common-consts/const';
import { MasterHeader } from '../../common-library/common-components/master-header';
import {
  ActionsColumnFormatter,
  TickColumnFormatter
} from '../../common-library/common-components/actions-column-formatter';
import { DeleteEntityDialog } from '../../common-library/common-components/delete-entity-dialog';
import {
  ModifyForm,
  ModifyInputGroup,
  ModifyPanel,
  RenderInfoDetail,
  SearchModel
} from '../../common-library/common-types/common-type';
import { InitMasterProps, InitValues, RoleArrayToObject, } from '../../common-library/helpers/common-function';
import { Route, Switch, useHistory } from 'react-router-dom';
import EntityCrudPage from '../../common-library/common-components/entity-crud-page';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { UserModel } from './user.model';
import { MasterEntityDetailDialog } from "../../common-library/common-components/master-entity-detail-dialog";
import * as Yup from "yup";
import { BanUser, Count, Create, Delete, DeleteMany, Get, GetAll, GetById, UnbanUser, Update } from "./user.service";
import {
  DisplayAddress,
  DisplayDate,
  DisplayDateTime,
  DisplayDownloadLink
} from "../../common-library/helpers/detail-helpers";
import { DetailImage } from "../../common-library/common-components/detail/detail-image";
import { Spinner } from "react-bootstrap";
import './style.scss'
import DeleteManyEntitiesDialog from "../../common-library/common-components/delete-many-entities-dialog";
import { MasterBody } from "../../common-library/common-components/master-body";
import { BlockOutlined, CheckOutlined } from '@material-ui/icons';
import { values } from 'lodash';
import { Tooltip } from '@material-ui/core';

const headerTitle = 'USER.MASTER.HEADER.TITLE';
const detailDialogTitle = 'USER.DETAIL_DIALOG.TITLE';
const moduleName = 'USER.MODULE_NAME';
const lockDialogTitle = 'USER.LOCK_DIALOG.TITLE';
const unlockDialogTitle = 'USER.UNLOCK_DIALOG.TITLE';
const lockBtn = 'USER.LOCK_DIALOG.LOCK_BTN';
const unlockBtn = 'USER.UNLOCK_DIALOG.UNLOCK_BTN';
const lockConfirmMessage = 'USER.LOCK_DIALOG.CONFIRM_MESSAGE';
const lockDialogBodyTitle = 'USER.LOCK_DIALOG.BODY_TITLE';
const lockingMessage = 'USER.LOCK_DIALOG.LOCKING_MESSAGE';
const createTitle = 'USER.CREATE.HEADER';
const updateTitle = 'USER.UPDATE.HEADER';

function User() {
  const intl = useIntl();

  const history = useHistory();
  const {
    entities,
    setEntities,
    deleteEntity,
    setDeleteEntity,
    createEntity,
    setCreateEntity,
    selectedEntities,
    setSelectedEntities,
    detailEntity,
    showDelete,
    setShowDelete,
    showDeleteMany,
    setShowDeleteMany,
    showDetail,
    setShowDetail,
    paginationProps,
    setPaginationProps,
    filterProps,
    setFilterProps,
    total,
    loading,
    setLoading,
    error,
    add,
    update,
    get,
    deleteMany,
    deleteFn,
    getAll,
    formatLongString,
  } = InitMasterProps<any>({
    getServer: Get,
    countServer: Count,
    createServer: Create,
    deleteServer: Delete,
    deleteManyServer: DeleteMany,
    getAllServer: GetAll,
    updateServer: Update,
  });

  const [currentTab, setCurrentTab] = useState<string | undefined>('0');
  const [trigger, setTrigger] = useState<boolean>(false);

  useEffect(() => {
    getAll(filterProps);
  }, [paginationProps, filterProps, trigger, currentTab]);

  const columns = useMemo(() => {
    return [
      {
        dataField: 'username',
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.USERNAME' })}`,
        ...SortColumn,
        align: 'center',
      },
      {
        dataField: 'kanji',
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.KANJI' })}`,
        ...SortColumn,
        formatter: (input: any) => <Tooltip style={{}} children={<span>{formatLongString(input, 4, 4)}</span>} title={input} />,
        align: 'center',
      },
      {
        dataField: 'romanji',
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.ROMANJI' })}`,
        formatter: (input: any) => <Tooltip style={{}} children={<span>{formatLongString(input, 4, 4)}</span>} title={input} />,
        ...SortColumn,
        align: 'center',
      },
      {
        dataField: 'mail',
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.MAIL' })}`,
        formatter: (input: any) => <Tooltip style={{}} children={<span>{formatLongString(input, 10, 10)}</span>} title={input} />,
        ...SortColumn,
        align: 'center',
      },
      {
        dataField: 'phone',
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.PHONE' })}`,
        ...SortColumn,
        align: 'center',
      },
      {
        dataField: 'isBanned',
        class: "btn-primary",
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.ISBANNED' })}`,
        formatter: (input: any) => !input ? <CheckOutlined style={successIconStyle} /> : <BlockOutlined style={dangerIconStyle} />,
        ...SortColumn,
      },
      {
        dataField: 'action',
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.ACTION_COLUMN' })}`,
        formatter: ActionsColumnFormatter,
        formatExtraData: {
          intl,
          // onShowDetail: (entity: UserModel) => {
          //   get(entity).then(() => {
          //     setShowDetail(true);
          //   })
          // },
          onEdit: (entity: any) => {
            console.log({ entity });
            setDeleteEntity(entity)
            setShowDelete(true);
            // history.push(`${window.location.pathname}/${entity._id}`);
          },
          // onLock: (entity: UserModel) => {
          //   setDeleteEntity(entity);
          //   setShowDelete(true);
          // },
        },
        ...NormalColumn,
        style: { minWidth: '130px' },
      }
    ]
  }, []);

  const masterEntityDetailDialog: RenderInfoDetail = useMemo((): RenderInfoDetail => [
    {
      className: 'col-md-6 col-12',
      dataClassName: 'col-md-12 col-12 text-lg-center',
      data: {
        image: {
          formatter: (input) => <DetailImage images={input} width={200} height={200} />
        },
      },
    },
  ], []);

  const searchModel: SearchModel = useMemo(() => ({
    // code: {
    //   type: 'string',
    //   label: 'USER.MASTER.SEARCH.CODE',
    //   disabled: currentTab === '1',
    // },
    username: {
      type: 'string',
      label: 'USER.MASTER.SEARCH.USERNAME',
      placeholder: 'USER.MASTER.SEARCH.USERNAME'
    },
    kanji: {
      type: 'string',
      label: 'USER.MASTER.SEARCH.KANJI',
      placeholder: 'USER.MASTER.SEARCH.KANJI'
    },
    romanji: {
      type: 'string',
      label: 'USER.MASTER.SEARCH.ROMANJI',
      placeholder: 'USER.MASTER.SEARCH.ROMANJI'
    },
    mail: {
      type: 'string',
      label: 'USER.MASTER.SEARCH.MAIL',
      placeholder: 'USER.MASTER.SEARCH.MAIL',
    },
    phone: {
      type: 'string-number',
      label: 'USER.MASTER.SEARCH.PHONE',
      placeholder: 'USER.MASTER.SEARCH.PHONE',
    },
    isBanned: {
      type: 'radio',
      label: 'USER.MASTER.SEARCH.ISBANNED',
    },
  }), [currentTab]);
  // const group1 = useMemo((): ModifyInputGroup => ({
  //   _subTitle: 'USER.MODIFY.DETAIL_INFO',
  //   _className: 'col-6 pr-xl-15 pr-md-10 pr-5',
  // image: {
  //   _type: 'image',
  //   maxNumber: 1,
  //   label: 'USER.MODIFY.IMAGE',
  //   isArray: false,
  // },
  // fullName: {
  //   _type: 'string',
  //   maxNumber: 1,
  //   label: 'USER.MODIFY.FULLNAME',
  // },
  // code: {
  //   _type: 'string',
  //   label: 'USER.MODIFY.CODE',
  //   disabled: true,
  // },
  // birthDay: {
  //   _type: 'date-time',
  //   required: true,
  //   label: 'USER.MODIFY.BIRTHDAY',
  // },
  // gender: {
  //   _type: 'radio',
  //   required: true,
  //   options: [
  //     {label: 'USER.MODIFY.GENDER_OPTION.MALE', value: '1'},
  //     {label: 'USER.MODIFY.GENDER_OPTION.FEMALE', value: '0'}
  //   ],
  //   label: 'USER.MODIFY.GENDER',
  // },
  // status: {
  //   _type: 'boolean',
  //   label: 'USER.MODIFY.STATUS',
  //   trueFalse: {
  //     true: '1',
  //     false: '0'
  //   }
  // },
  // }), []);
  // const group2 = useMemo((): ModifyInputGroup => ({
  //   _subTitle: 'EMPTY',
  //   _className: 'col-6 pl-xl-15 pl-md-10 pl-5',
  // identifier: {
  //   _type: 'string-number',
  //   required: true,
  //   label: 'USER.MODIFY.IDENTIFIER',
  // },
  // email: {
  //   _type: 'string',
  //   required: true,
  //   label: 'USER.MODIFY.EMAIL',
  // },
  // phone: {
  //   _type: 'string-number',
  //   required: true,
  //   label: 'USER.MODIFY.PHONE',
  // },
  // role: {
  //   _type: 'radio',
  //   required: true,
  //   options: [
  //     {label: 'USER.MODIFY.ROLE_OPTION.STUDENT', value: 'student'},
  //     {label: 'USER.MODIFY.ROLE_OPTION.COORDINATOR', value: 'coordinator'},
  //     {label: 'USER.MODIFY.ROLE_OPTION.MANAGER', value: 'manager'},
  //   ],
  //   label: 'USER.MODIFY.ROLE',
  // },
  // }), []);

  // const createForm = useMemo((): ModifyForm => ({
  //   _header: createTitle,
  //   panel1: {
  //     _title: '',
  //     // group1: group1,
  //     // group2: group2,
  //   },
  // }), [group1, group2]);

  // const updateForm = useMemo((): ModifyForm => {
  //   return ({ ...createForm, _header: updateTitle });
  // }, [createForm]);

  // const validationSchema = useMemo(() => Yup.object().shape({
  // phone: Yup.string()
  //   .max(11, 'VALIDATE.ERROR.INVALID_INPUT')
  //   .min(8, 'VALIDATE.ERROR.INVALID_INPUT'),
  // birthDay: Yup.date().max(new Date(), 'VALIDATE.ERROR.MUST_LESS_THAN_TODAY'),

  // owner: Yup.object().shape({
  //   phone: Yup.string()
  //     .max(11, 'VALIDATE.ERROR.INVALID_INPUT')
  //     .min(8, 'VALIDATE.ERROR.INVALID_INPUT'),
  // })
  // }), []);
  // const actions: any = useMemo(() => ({
  //   type: 'inside',
  //   data: {
  //     save: {
  //       role: 'submit',
  //       type: 'submit',
  //       linkto: undefined,
  //       className: 'btn btn-primary mr-8 fixed-btn-width',
  //       label: 'SAVE_BTN_LABEL',
  //       icon: loading ? (<Spinner style={iconStyle} animation="border" variant="light" size="sm" />) :
  //         (<SaveOutlinedIcon style={iconStyle} />)
  //     },
  //     cancel: {
  //       role: 'link-button',
  //       type: 'button',
  //       linkto: '/account/user',
  //       className: 'btn btn-outline-primary fixed-btn-width',
  //       label: 'CANCEL_BTN_LABEL',
  //       icon: <CancelOutlinedIcon />,
  //     }
  //   }
  // }), [loading]);
  // const initCreateValues: any = useMemo(() => ({ ...InitValues(createForm), status: '0' }), [createForm]);

  return (
    <Fragment>
      <Switch>
        {/* <Route path={`${HomePageURL.user}/0000000`}>
          <EntityCrudPage
            moduleName={moduleName}
            onModify={add}
            formModel={createForm}
            entity={createEntity}
            actions={actions}
            validation={validationSchema}
            homePageUrl={HomePageURL.user}
          />
        </Route> */}
        {/* <Route path={`/account/user/:code`}>
          {({ match }) => (
            <EntityCrudPage
              onModify={update}
              moduleName={moduleName}
              code={match?.params.code}
              get={GetById}
              formModel={updateForm}
              actions={actions}
              validation={validationSchema}
              homePageUrl={HomePageURL.user}
            />
          )}
        </Route> */}
        <Route path={`${HomePageURL.user}`} exact={true}>
          <MasterHeader
            title={headerTitle}
            onSearch={(value) => {
              setPaginationProps(DefaultPagination)
              setFilterProps(value)
              console.log({ value });
            }}
            searchModel={searchModel}
          />
          <div className="user-body">
            <MasterBody
              title='USER.MASTER.TABLE.TITLE'
              optionTitle={Object.keys(filterProps).length > 0 ? (total > 0 ? `${total} 結果が見つかりました。` : "ユーザーが見つかりませんでした。") : ""}
              // onCreate={() => {
              //   setCreateEntity(initCreateValues);
              //   history.push(`${window.location.pathname}/0000000`);
              // }}
              // onDeleteMany={() => setShowDeleteMany(true)}
              selectedEntities={selectedEntities}
              entities={entities}
              total={total}
              columns={columns as any}
              loading={loading}
              paginationParams={paginationProps}
              setPaginationParams={setPaginationProps}
              isShowId={false}
            />
          </div>
        </Route>
      </Switch>
      <MasterEntityDetailDialog
        title={detailDialogTitle}
        moduleName={moduleName}
        entity={detailEntity}
        onHide={() => {
          setShowDetail(false);
        }}
        show={showDetail}
        size={'lg'}
        renderInfo={masterEntityDetailDialog} />
      <DeleteEntityDialog
        entity={deleteEntity}
        onDelete={async () => {
          setLoading(true);
          const result = deleteEntity.isBanned ? await UnbanUser(deleteEntity) : await BanUser(deleteEntity);
          console.log(result);
          if (result.success) {
            setTrigger(!trigger);
          }
          setShowDelete(false);
          setLoading(false);
        }}
        isShow={showDelete}
        loading={loading}
        error={error}
        onHide={() => {
          setShowDelete(false);
        }}
        title={deleteEntity?.isBanned ? unlockDialogTitle : lockDialogTitle}
        confirmMessage={lockConfirmMessage}
        bodyTitle={lockDialogBodyTitle}
        deletingMessage={" "}
        //非アクティブ化 || アクティブ化
        deleteBtn={deleteEntity?.isBanned ? unlockBtn : lockBtn}
        cancelBtn={"COMMON.BTN_CANCEL"}
      />
    </Fragment>
  );
}

export default User
