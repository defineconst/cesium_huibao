import { request } from '@/utils/request';

export async function fetchAll(params) {
  return request(`/api/user/findAll`, {
    method: 'GET'
  });
}

export async function deleteUser(params) {
  return request(`/api/user/delete/${params.id}`, {
    method: 'GET'
  });
}

export async function fetchTravel(params){
  return request(`/api/travel/findTravelOrderByDate/${params.id}`,{
    method: 'GET'
  })
}