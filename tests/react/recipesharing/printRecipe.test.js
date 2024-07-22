import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './printRecipe';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Print Recipe successfully', async () => {
  fetchMock.get('/api/recipe/1', { body: { title: 'Printable Recipe' }, status: 200 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Print Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Printable Recipe')).toBeInTheDocument();
}, 10000);

test('Print Recipe failure shows error message', async () => {
  fetchMock.get('/api/recipe/1', { body: { message: 'Error printing recipe' }, status: 500 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Print Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error printing recipe')).toBeInTheDocument();
}, 10000);

