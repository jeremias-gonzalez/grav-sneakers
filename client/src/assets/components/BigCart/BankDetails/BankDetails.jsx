import React from 'react';

const BankDetails = () => {
  return (
    <div className="bank-details text-xl mx-auto my-10">
      <h3 className='montserrat2'>Detalles de la Cuenta Bancaria</h3>
      <p className='montserrat'>Banco: BBVA Frances</p>
      <p className='montserrat'>Nombre del Titular: Jeremias Gonzalez</p>
      <p className='montserrat'>CBU:0170267740000007940275</p>
      <p className='montserrat'>Tipo de Cuenta: Caja de Ahorro</p>
      <p className='montserrat'>Por favor, realiza la transferencia y envíanos el comprobante.</p>
    </div>
  );
};

export default BankDetails;