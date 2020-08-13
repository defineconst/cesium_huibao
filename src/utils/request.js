import {message} from 'antd';
import _ from 'lodash';

const Ajax = require('axios');

const delayCloseTime = 5;

const prefix = '';


function errorHandle({ errorCode=500, errorMsg='服务器错误', errorDetails }, options) {
  message.error(errorMsg,delayCloseTime,);
}
function commonRequest(url, options, requestPrefix = '') {
  let requestOptions = options;
  if ((options.method === 'GET' || !options.method) && options.data) {
    requestOptions = {
      ...requestOptions,
      params: options.data,
      data: null
    };
  }

  if ((options.method === 'POST' || options.method === 'PUT') && !options.data && options.params) {
    requestOptions = {
      ...requestOptions,
      data: options.params,
      params: null
    };
  }

  const timeStamp = `_t=${new Date().getTime()}`;

  const query = url.indexOf('?') >= 0 ? '&' : '?';

  return Ajax({
    method: requestOptions.method || 'GET',
    url: `${requestPrefix}${url}${query}${timeStamp}`,
    data: requestOptions.data || {},
    params: requestOptions.params || {},
    timeout: 15000
  }).then(
    ({data}) => {
      if (data.success === false) {
        errorHandle({
          errorCode: data.responseCode,
          errorMsg: data.responseMsg,
        }, options);
      } 
      return {...data};
    }
  ).catch(error => errorHandle(error, requestOptions));
}

export function request(url, options = {}) {
  return commonRequest(url, options, prefix);
}

/* eslint-disable */
export function fileUpload(url, data) {
  const form = new FormData();
  _.each(
    data,
    (value, key) => {
      form.append(key, value);
    }
  );
  return Ajax.post(
    prefix + url,
    form,
    {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
  ).then(response => ({data: response.data || ''}))
    .catch(error => errorHandle(error));
}

