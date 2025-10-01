import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './manageSupplierContacts_receiveAutomatedReorderAlerts_sortProductsByName';

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

test('Sends automated reorder alert when stock falls below level', async () => {
  fetchMock.get('/api/stock/monitor', { stock: 10, reorderLevel: 20 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/stock/monitor').length).toBe(1);
  expect(screen.getByText(/Automated reorder alert sent/i)).toBeInTheDocument();
}, 10000);

test('Shows error on failure when sending automated reorder alerts', async () => {
  fetchMock.get('/api/stock/monitor', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/stock/monitor').length).toBe(1);
  expect(screen.getByText(/Error sending automated reorder alert/i)).toBeInTheDocument();
}, 10000);

test('Sorting products by name orders them alphabetically.', async () => {
  fetchMock.get('/products?sort=name', { products: [{ id: 1, name: 'A Product' }, { id: 2, name: 'B Product' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/sort by name/i)); });

  expect(fetchMock.calls('/products?sort=name')).toHaveLength(1);
  expect(screen.getByText(/a product/i)).toBeInTheDocument();
}, 10000);

test('Sorting products by name shows an error message if failed.', async () => {
  fetchMock.get('/products?sort=name', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/sort by name/i)); });

  expect(fetchMock.calls('/products?sort=name')).toHaveLength(1);
  expect(screen.getByText(/error sorting products/i)).toBeInTheDocument();
}, 10000);
