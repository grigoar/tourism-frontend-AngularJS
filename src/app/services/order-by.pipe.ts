import { Pipe, PipeTransform } from '@angular/core';
//import { orderBy } from 'lodash';

@Pipe({
  name: 'orderBy',
  pure: true
})
export class OrderByPipe implements PipeTransform {

  /*transform(value: any[], order = '', column: string = ''): any[] {
    if (!value || order === '' || !order) { return value; } // no array
    if (!column || column === '') { return orderBy(value); } // sort 1d array
    if (value.length <= 1) { return value; } // array with only one item
    return orderBy(value, [column], [order]);
  }*/
  transform(array: Array<any>, orderField: string, orderType: boolean): Array<string> {
    array.sort((a: any, b: any) => {
      let ae = a[orderField];
      let be = b[orderField];
      if (ae == undefined && be == undefined) return 0;
      if (ae == undefined && be != undefined) return orderType ? 1 : -1;
      if (ae != undefined && be == undefined) return orderType ? -1 : 1;
      if (ae == be) return 0;
      return orderType ? (ae.toString().toLowerCase() > be.toString().toLowerCase() ? -1 : 1) : (be.toString().toLowerCase() > ae.toString().toLowerCase() ? -1 : 1);
    });
    return array;
  }
}
/*  transform(value: any[], propertyName: string): any[] {
    if (propertyName)
      return value.sort((a: any, b: any) => b[propertyName].localeCompare(a[propertyName]));
    else
      return value;
  }

}*/
