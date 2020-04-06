import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Steps, Input, Button, Carousel, Result, Anchor, Select, Avatar } from 'antd';
import { useTranslation } from 'react-i18next';
import { APIClient } from 'src/lib/API/server';
import './main-page.scss';
import { MultipleS3Uploader } from './multiple-s3-uploader/multiple-s3-uploader';

interface IProp {}

let url: string[] = [];

type TemplateObject = {
  title: string;
  description: string;
  imageUrl: string;
};

export const AddTemplatePage = (props: IProp) => {
  const numberOfStage = 4;
  const { t, i18n } = useTranslation();

  const [template, setTemplate]: [Partial<any>, (input: Partial<any>) => void] = useState({});
  const [isCreating, setIsCreating]: [boolean, (input: boolean) => void] = useState<boolean>(false);
  const [isUpdating, setIsUpdating]: [boolean, (input: boolean) => void] = useState<boolean>(false);
  const [stageIndex, setStageIndex]: [number, (input: number) => void] = useState(0);
  const [finishedFiles, setFinishedFiles]: [string[], (input: string[]) => void] = useState<string[]>([]);

  const carousel = useRef<Carousel>(null);

  useEffect(() => {
    setIsCreating(true);
    const form = {
      name: '',
      description: ''
    };

    new APIClient().templates.createTemplate(form).then((t: any) => {
      if (typeof t !== 'string') {
        setTemplate({ ...template, ...t });
        setIsCreating(false);
      }
    });
  }, []);

  const saveObject = () => {
    new APIClient().templates.updateTemplate(template);
  };

  const nextStage = () => {
    if (stageIndex + 1 < numberOfStage) {
      setStageIndex(stageIndex + 1);
      saveObject();
      carousel.current?.next();
    }
  };

  const prevStage = () => {
    if (stageIndex > 0) {
      setStageIndex(stageIndex - 1);
      carousel.current?.prev();
    }
  };

  const getSignedUrl = async (file: File, cb: any) => {
    const fileName = (file as any).webkitRelativePath || file.name;
    const res = await new APIClient().templates.getSignedURL(template.id, fileName, file.type);

    cb({ signedUrl: res });
  };

  const addUrl = (nurl: string) => {
    url = [...url, nurl];

    setFinishedFiles([...url]);
  };

  return (
    <>
      <div className="whole-page">
        <div className="content">
          <div className="add-template-body">
            <Card>
              <Carousel dots={false} ref={carousel}>
                <div>
                  <MultipleS3Uploader
                    onFinish={(result, file) => {
                      const fileName = (file as any).webkitRelativePath || file.name;
                      addUrl(fileName);
                    }}
                    getSignedUrl={getSignedUrl}
                    uploadRequestHeaders={{}}
                  />
                </div>
              </Carousel>

              <Input.Group size="large">
                <div className="add-template-fill-description">
                  <Row gutter={[4, 4]}>
                    <Col span={12}>
                      <Button onClick={prevStage}>{t('Prev')}</Button>
                    </Col>
                    <Col span={12}>
                      {stageIndex !== 2 && (
                        <Button type="primary" className="right" onClick={nextStage}>
                          {t('Next')}
                        </Button>
                      )}
                      {stageIndex === 2 && (
                        <Button type="primary" className="right" onClick={nextStage}>
                          {t('Next')}
                        </Button>
                      )}
                    </Col>
                  </Row>
                </div>
              </Input.Group>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTemplatePage;
