// pages/index/index.jsx
import { useEffect, useState } from 'react';
import { Canvas, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import jsBarcode from 'jsbarcode';
import { Button } from '@nutui/nutui-react-taro';

interface BarcodeProps {
  value?: string;
  format?: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
}

const Index = ({ value }: BarcodeProps) => {
  const [barcodeList, setBarcodeList] = useState([]); // 条形码列表
  useEffect(() => {
    setBarcodeList(value.split(' '));
  }, [value]);

  // 生成条形码的函数
  const generateBarcodeAsync = (barcode, index) => {
    return new Promise((resolve, reject) => {
      // 获取 Taro 小程序 Canvas 上下文
      const query = Taro.createSelectorQuery();
      query
        .select(`#cc${barcode}${index}`)
        .fields({ node: true, size: true })
        .exec(res => {
          if (!res || !res[0] || !res[0].node) {
            return reject(`Canvas not found for barcode: ${barcode}`);
          }

          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(`Failed to get 2D context for canvas: ${barcode}`);
          }

          // 设置条形码的尺寸
          canvas.width = res[0].width || 300;
          canvas.height = 100;

          try {
            // 使用 jsBarcode 绘制条形码到 Canvas 上
            jsBarcode(canvas, barcode, {
              format: 'CODE128',
              width: 2,
              height: 100,
              displayValue: true,
            });
            resolve(`Barcode generated successfully: ${barcode}`);
          } catch (error) {
            reject(`Failed to draw barcode: ${barcode}, ${error}`);
          }
        });
    });
  };
  const generateAllBarcodes = async () => {
    try {
      // 并发生成所有条形码
      const results = await Promise.all(
        barcodeList.map((barcode, index) =>
          generateBarcodeAsync(barcode, index),
        ),
      );
      console.log('All barcodes generated:', results);
    } catch (error) {
      console.error('Error generating barcodes:', error);
    }
  };

  return (
    <View>
      <Button
        type="success"
        onClick={() => {
          generateAllBarcodes();
        }}
      >
        生成条形码
      </Button>
      {barcodeList.map((item, index) => {
        console.log(`${item}${index}`);
        return (
          <Canvas
            id={`cc${item}${index}`}
            type="2d"
            style={{ width: '100%', height: '100px' }}
          />
        );
      })}
    </View>
  );
};

export default Index;
