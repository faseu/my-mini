// App.js
import { useState } from 'react';
import Barcode from '../../components/Barcode';
import { Button, TextArea } from '@nutui/nutui-react-taro';

const App = () => {
  const [barcodeValue, setBarcodeValue] = useState('123456789012');

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#eee' }}>
      <TextArea
        value={barcodeValue}
        onChange={value => setBarcodeValue(value)}
        placeholder="输入条形码内容"
      />

      <Barcode
        value={barcodeValue}
        format="CODE128"
        width={2}
        height={50}
        displayValue
      />
    </div>
  );
};

export default App;
