import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayApp_viewApp';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Display walkability score successfully', async () => {
  fetchMock.get('/api/walkability-score', { score: 85 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-walkability-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('85')).toBeInTheDocument();
}, 10000);

test('Display walkability score fails with error', async () => {
  fetchMock.get('/api/walkability-score', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-walkability-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error displaying walkability score.')).toBeInTheDocument();
}, 10000);

test('View similar properties successfully', async () => {
  fetchMock.get('/api/similar-properties', { properties: [{ id: 1, name: "Prop 1" }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-similar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Prop 1')).toBeInTheDocument();
}, 10000);

test('View similar properties fails with error', async () => {
  fetchMock.get('/api/similar-properties', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-similar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error loading similar properties.')).toBeInTheDocument();
}, 10000);