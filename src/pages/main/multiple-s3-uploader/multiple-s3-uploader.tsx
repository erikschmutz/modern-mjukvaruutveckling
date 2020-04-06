import React, { useState, useRef, useEffect, FC, ReactElement } from 'react';
import ReactS3Uploader, { ReactS3UploaderProps } from 'react-s3-uploader';
import { Progress, Row, Col } from 'antd';
import { InboxOutlined, FileSyncOutlined } from '@ant-design/icons';
import './multiple-s3-uploader.scss';
import Dragger from 'antd/lib/upload/Dragger';
interface IProps extends ReactS3UploaderProps {
  fileAddOn?: ReactElement;
  onFileDownloadComplete?: (event: { url: string; name: string }) => void;
}

type Loader = {
  progress: number;
  title: string;
  status?: 'exception';
};
type LoaderMap = Record<string, Loader>;

const map: LoaderMap = {};

export const MultipleS3Uploader = (props: IProps) => {
  const [loaders, setLoaders]: [LoaderMap, any] = useState<LoaderMap>({});
  const folderRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<ReactS3Uploader>(null);

  useEffect(() => {
    if (folderRef.current != null) {
      (folderRef.current as any).directory = true;
      (folderRef.current as any).webkitdirectory = true;
    }
  }, []);

  const viewLoaders = function(loader: Loader, index: number) {
    return (
      <div className={'multiple-s3-uploader-loader'}>
        <Progress status={loader.status} percent={loader.progress} />
        <p>{loader.title}</p>
        {props.fileAddOn}
      </div>
    );
  };

  const uploadFolder = (event: any) => {
    if (uploadRef.current && formRef.current) {
      uploadRef.current.files = event.target.files;
      (formRef.current as any).uploadFile();
    }
  };

  const updateLoaders = (name: string, loader: Loader) => {
    map[name] = loader;
    setLoaders({ ...map });
  };

  const onProgress = (percent: number, status: string, file: File) => {
    const fileName = (file as any).webkitRelativePath || file.name;
    updateLoaders(fileName, { title: fileName, progress: percent });
    return props.onProgress?.(percent, status, file);
  };

  const onError = (message: string) => {
    const key = Object.keys(map).pop() as string;
    const prev = Object.values(map).pop() as Loader;
    updateLoaders(key, { ...prev, status: 'exception' });
    return props.onError?.(message);
  };

  const onFinish = () => {};

  return (
    <div className="multiple-s3-uploader">
      <Row>
        <Col span={12}>
          <label className="custom-file-upload">
            <FileSyncOutlined />
            <ReactS3Uploader
              inputRef={uploadRef as any}
              autoUpload={true}
              {...props}
              onProgress={onProgress}
              ref={formRef}
              onError={onError}
            />
          </label>
        </Col>
        <Col span={12}>
          <label>
            <InboxOutlined />
            <input type="file" ref={folderRef as any} onChange={uploadFolder} />
          </label>
        </Col>
      </Row>
      {Object.entries(loaders).map((v, i) => viewLoaders(v[1], i))}
    </div>
  );
};
