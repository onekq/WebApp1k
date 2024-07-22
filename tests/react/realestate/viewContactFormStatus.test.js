import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ViewContactFormStatus from './viewContactFormStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully shows contact form status', async () => {
  fetchMock.post('/api/contact/status', 200);

  await act(async () => { render(<MemoryRouter><ViewContactFormStatus /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-status-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('status-success')).toBeInTheDocument();
}, 10000);

test('fails to show contact form status and shows error message', async () => {
  fetchMock.post('/api/contact/status', 500);

  await act(async () => { render(<MemoryRouter><ViewContactFormStatus /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-status-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('status-error')).toBeInTheDocument();
}, 10000);

