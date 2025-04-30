import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const FilterPanel = ({ onApply }) => {
  const [region, setRegion] = useState('');
  const [language, setLanguage] = useState('');

  const handleApply = () => {
    onApply({ region, language });
  };

  const handleClear = () => {
    setRegion('');
    setLanguage('');
    onApply({ region: '', language: '' });
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center align-items-center g-2">
        <Col xs={12} md={4}>
          <Form.Select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">🌐 All Regions</option>
            <option value="Africa">Africa</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Americas">Americas</option>
            <option value="Oceania">Oceania</option>
          </Form.Select>
        </Col>
  
        <Col xs={12} md="auto">
          <Button variant="primary" className="me-2" onClick={handleApply}>
            Apply
          </Button>
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default FilterPanel;