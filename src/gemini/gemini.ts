import {Storage} from 'megajs';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import {GoogleGenAI, createUserContent, createPartFromUri} from '@google/genai';
import { pick } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import RNBlobUtil from 'react-native-blob-util';


const ai = new GoogleGenAI({apiKey: 'AIzaSyCX5MikS43fqeQjW6Y9U6UwF4pZZX48sw8'});

export const check = async (url) => {
  try {
    const res = await fetch('http://192.168.137.1:3000/api/main-answer', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({url:url}),
    });
    const result = await res.json()
    console.log(result);

  } catch (e) {
    console.error(e.message);
  }
};


const authorize = async () => {
  const keyId = '005f9adfe9072bf0000000001';
  const appKey = 'K005N7gR5Z15aNmRqepfOWn6X2mAa2Q';

  const headers = {
    Authorization: 'Basic ' + btoa(`${keyId}:${appKey}`),
  };

  const res = await axios.get(
    'https://api.backblazeb2.com/b2api/v2/b2_authorize_account',
    {headers},
  );
  return res.data;
};

const uploadAndProcessPDF = async () => {
  try {
    // let authData = await authorize();
    // const [file] = await pick({type: 'application/pdf'});
    // let myfile;
    // console.log(file);

    // const getUploadUrl = async (authData, bucketId) => {
    //   try {
    //     const res = await axios.post(
    //       `${authData.apiUrl}/b2api/v2/b2_get_upload_url`,
    //       {bucketId},
    //       {headers: {Authorization: authData.authorizationToken}},
    //     );
    //     return res.data;
    //   } catch (e) {
    //     console.error(e);
    //   }
    // };

    // const uploadFile = async (file, uploadData) => {
    //   const filePath = file.uri.startsWith('file://')
    //     ? file.uri.slice(7)
    //     : file.uri;

    //   const headers = {
    //     Authorization: uploadData.authorizationToken,
    //     'X-Bz-File-Name': encodeURIComponent(file.name),
    //     'Content-Type': 'application/pdf',
    //     'X-Bz-Content-Sha1': 'do_not_verify',
    //   };

    //   try {
    //     const response = await RNBlobUtil.fetch(
    //       'POST',
    //       uploadData.uploadUrl,
    //       headers,
    //       RNBlobUtil.wrap(filePath), // Streams the file directly from disk
    //     );
    //     return response.json();
    //   } catch (error) {
    //     throw new Error('Upload failed: ' + error.message);
    //   }
    // };
    // console.log('--------------');
    // if (!authData) {
    //   authData = await authorize();
    // }

    // console.log(authData);
    // const uploadData = await getUploadUrl(authData, '2f39aa9d5f8e396097720b1f');
    // console.log(uploadData);
    // const result = await uploadFile(file, uploadData);
    // console.log('Uploaded:', result);
    // const url = 'https://f005.backblazeb2.com/file/CheckMate/' + result.fileName;

    // await check(url);

    await check(
      'https://f005.backblazeb2.com/file/CheckMate/DocScanner 4 Jun 2025 1-38 am.pdf',
    );

  } catch (error) {
    console.error( error );
    throw error;
  }
};

export default uploadAndProcessPDF;
