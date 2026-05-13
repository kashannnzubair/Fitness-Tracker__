import React, { useState } from 'react';
import styled from 'styled-components';
import { FileDownload, PictureAsPdf, TableChart } from '@mui/icons-material';
import { CircularProgress, Menu, MenuItem, IconButton } from '@mui/material';

const Button = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.gradient};
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ExportButton = ({ data, filename, type = 'default' }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const exportToCSV = () => {
    setIsLoading(true);
    const headers = Object.keys(data[0] || {});
    const csvRows = [];
    
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setIsLoading(false);
    handleClose();
  };

  const exportToJSON = () => {
    setIsLoading(true);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    setIsLoading(false);
    handleClose();
  };

  if (type === 'simple') {
    return (
      <Button onClick={exportToCSV} disabled={isLoading}>
        {isLoading ? <CircularProgress size={18} style={{ color: 'white' }} /> : <><FileDownload /> Export CSV</>}
      </Button>
    );
  }

  return (
    <>
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? <CircularProgress size={18} style={{ color: 'white' }} /> : <><FileDownload /> Export</>}
      </Button>
      
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={exportToCSV}>
          <TableChart sx={{ mr: 1, fontSize: 18 }} /> Export as CSV
        </MenuItem>
        <MenuItem onClick={exportToJSON}>
          <PictureAsPdf sx={{ mr: 1, fontSize: 18 }} /> Export as JSON
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExportButton;