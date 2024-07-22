import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './manageSupplierContacts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully manages supplier contacts.', async () => {
  fetchMock.get('/api/suppliers/1/contacts', { status: 200, body: { contacts: ['Contact1', 'Contact2'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('manage-contacts-button')); });

  expect(fetchMock.called('/api/suppliers/1/contacts')).toBe(true);
  expect(screen.getByText('Contact1')).toBeInTheDocument();
  expect(screen.getByText('Contact2')).toBeInTheDocument();
}, 10000);

test('Fails to manage supplier contacts.', async () => {
  fetchMock.get('/api/suppliers/1/contacts', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('manage-contacts-button')); });

  expect(fetchMock.called('/api/suppliers/1/contacts')).toBe(true);
  expect(screen.getByText('Failed to manage contacts')).toBeInTheDocument();
}, 10000);

