import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './searchArticles_ticketSorting';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully searches for articles in the knowledge base', async () => {
  fetchMock.get('path/to/api/articles?search=term', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'term' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('search-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('articles-list')).toBeInTheDocument();
}, 10000);

test('fails to search for articles in the knowledge base with error message', async () => {
  fetchMock.get('path/to/api/articles?search=term', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'term' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('search-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('sorts tickets by submission date', async () => {
  fetchMock.get('/api/tickets?sort=submissionDate', { status: 200, body: [{ id: 2, date: '2023-01-01' }, { id: 1, date: '2023-01-02' }] });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Date')); });
  
  expect(fetchMock.calls('/api/tickets?sort=submissionDate').length).toBe(1);
  expect(screen.getByText('2023-01-01')).toBeInTheDocument();
  expect(screen.getByText('2023-01-02')).toBeInTheDocument();
}, 10000);

test('shows error if sorting tickets fails', async () => {
  fetchMock.get('/api/tickets?sort=submissionDate', 500);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Date')); });
  
  expect(fetchMock.calls('/api/tickets?sort=submissionDate').length).toBe(1);
  expect(screen.getByText('Failed to sort tickets')).toBeInTheDocument();
}, 10000);