/* eslint-disable sort-keys-fix/sort-keys-fix */
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { Settings } from './_types';


const datasetPath = `api/core/dataset/list`; 
const searchTestPath = `api/core/dataset/searchTest`; 

const getDatasetList = async (args: { parentId: string }, settings: Settings): Promise<any> => {
  
  const baseURL = settings.BASE_URL;
  const apiKey = settings.API_KEY;

  
  const params = {
    parentId: args.parentId,
  };


  // 配置 Axios 实例
  const axiosConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `${baseURL}/${datasetPath}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${apiKey}`
    },
    params: params,
  };


  try {
    // console.log('Axios发送请求的配置信息:', axiosConfig);
    const res = await axios(axiosConfig);

    const responseData = res.data; // Axios 的响应数据在 res.data 中
    // console.log('返回的数据:', responseData);

    const results = responseData.data;

    return results.map((item: any) => ({   // 重新映射一下返回结果，同时会把 results 里面的其他内容删除掉，只保留以下字段内容
      _id: item._id,
      name: item.name,
      intro: item.intro,
      vectorModel: item.vectorModel.model,
    }));

  } catch (error) {
    const axiosError = error as AxiosError;  // 断言error类型为AxiosError
    console.error('Error during request:', axiosError);
    if (axiosError.response) {
      console.error('Response data:', axiosError.response.data);
      console.error('Response status:', axiosError.response.status);
      console.error('Response headers:', axiosError.response.headers);
    } else if (axiosError.request) {
      console.error('No response received:', axiosError.request);
    } else {
      console.error('Error setting up request:', axiosError.message);
    }
    throw error;
  } 
};


const searchChunksFromDataset = async (args: { datasetId: string, limit: number, searchMode: string, similarity: number, text: string, usingReRank: boolean }, settings: Settings): Promise<any> => {

  const baseURL = settings.BASE_URL;
  const apiKey = settings.API_KEY;
  
  const data = {
    datasetId: args.datasetId,
    limit: args.limit,
    similarity: args.similarity,
    searchMode: args.searchMode,
    text: args.text,
    usingReRank: args.usingReRank
  };
  // console.log('searchChunksFromDataset params:', data);

  // 配置 Axios 实例
  const axiosConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `${baseURL}/${searchTestPath}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${apiKey}`
    },
    data: data,
  };


  try {
    // console.log('Axios发送请求的配置信息:', axiosConfig);
    const res = await axios(axiosConfig);

    const responseData = res.data; // Axios 的响应数据在 res.data 中
    // console.log('返回的数据:', responseData);

    const results = responseData.data.list;

    // 如果 results 为空，则直接返回 {}
    if (!results || results.length === 0) {
      return {message: 'No results found' };
      }

    return results.map((item: any) => ({   // 重新映射一下返回结果，同时会把 results 里面的其他内容删除掉，只保留以下字段内容
      q: item.q,
      a: item.a,
      chunkIndex: item.chunkIndex,
      sourceName: item.sourceName,
      score: item.score,
      tokens: item.tokens
    }));

  } catch (error) {
    const axiosError = error as AxiosError;  // 断言error类型为AxiosError
    console.error('Error during request:', axiosError);
    if (axiosError.response) {
      console.error('Response data:', axiosError.response.data);
      console.error('Response status:', axiosError.response.status);
      console.error('Response headers:', axiosError.response.headers);
    } else if (axiosError.request) {
      console.error('No response received:', axiosError.request);
    } else {
      console.error('Error setting up request:', axiosError.message);
    }
    throw error;
  } 
};


export { getDatasetList, searchChunksFromDataset };
