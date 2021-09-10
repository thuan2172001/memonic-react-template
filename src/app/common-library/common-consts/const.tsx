import { SortOrder } from 'react-bootstrap-table-next';
import { PaginationProps } from '../common-types/common-type';
import { HeaderSortingClasses, SortCaret } from '../helpers/table-sorting-helpers';

export type OrderType = '1' | '-1';

export const SortDefault: { dataField: any; order: string }[] = [
  { dataField: '', order: 'desc' },
];
export const SizePerPageList = [
  { text: '5', value: 5 },
  { text: '10', value: 10 },
  { text: '15', value: 15 },
  { text: '20', value: 20 },
];
export const DefaultPagination: PaginationProps = {
  sortBy: SortDefault[0].dataField,
  sortType: SortDefault[0].order,
  page: 1,
  limit: 5,
};
export const iconStyle = {
  fontSize: 15, transform: 'translateY(-1px)', marginRight: 4
};

export const primaryIconStyle = {
  fontSize: 15, transform: 'translateY(-1px)', marginRight: 4, color: "#61B3FF"
};

export const successIconStyle = {
  fontSize: 15, transform: 'translateY(-1px)', marginRight: 4, color: "#28a745"
};

export const dangerIconStyle = {
  fontSize: 15, transform: 'translateY(-1px)', marginRight: 4, color: "#dc3545"
};

export const SortColumn = {
  sort: true,
  sortCaret: SortCaret,
  headerSortingClasses: HeaderSortingClasses,
  headerClasses: 'text-center',
  classes: 'text-center',
};

export const NormalColumn = {
  headerClasses: 'text-center',
  classes: 'text-center pr-0',
};

export const StatusValue = 1;

// thuan123

export const HomePageURL = {
  home: '/dashboard',
  user: '/user-management',
}
