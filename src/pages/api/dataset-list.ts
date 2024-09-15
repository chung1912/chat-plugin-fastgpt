import {
    PluginErrorType,
    createErrorResponse,
    getPluginSettingsFromRequest,
  } from '@lobehub/chat-plugin-sdk';
  
  import { Settings } from './_types';
  import { getDatasetList } from './_utils';
  
  
  
  export const config = {
    runtime: 'edge',
  };
  
  
  export default async (req: Request) => {
    if (req.method !== 'POST') return createErrorResponse(PluginErrorType.MethodNotAllowed);
  
    const settings = getPluginSettingsFromRequest<Settings>(req);
  
    if (!settings)
      return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
        message: 'Plugin settings not found.',
      });
  
    try {
      const args = await req.json();
      // console.log('请求参数', args);
  
      const result = await getDatasetList(args, settings);
  
      return new Response(JSON.stringify(result));
    } catch (error) {
      return createErrorResponse(PluginErrorType.PluginServerError, error as object);
    }
  };
  