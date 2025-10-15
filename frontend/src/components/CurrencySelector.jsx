import React from 'react';
import { 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Box,
  Typography
} from '@mui/material';
import { useCurrency } from '../context/CurrencyContext';

const CurrencySelector = ({ variant = 'standard', size = 'small' }) => {
  const { currency, updateCurrency } = useCurrency();

  const handleChange = (event) => {
    updateCurrency(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth size={size}>
        <InputLabel id="currency-select-label">Currency</InputLabel>
        <Select
          labelId="currency-select-label"
          id="currency-select"
          value={currency}
          label="Currency"
          onChange={handleChange}
          variant={variant}
        >
          <MenuItem value="USD">USD ($)</MenuItem>
          <MenuItem value="INR">INR (₹)</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default CurrencySelector;