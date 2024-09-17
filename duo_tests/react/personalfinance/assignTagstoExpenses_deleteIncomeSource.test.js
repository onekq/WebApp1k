import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './assignTagstoExpenses_deleteIncomeSource';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('assigns tags to expenses successfully', async () => {
  fetchMock.post('/api/tag', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Groceries' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-tag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tag added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to assign tags to expenses', async () => {
  fetchMock.post('/api/tag', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Groceries' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-tag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding tag.')).toBeInTheDocument();
}, 10000);

test('successfully deletes an income source', async () => {
  fetchMock.delete('/income/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete income source/i));
  });

  expect(fetchMock.calls('/income/1')).toHaveLength(1);
  expect(screen.getByText(/income source deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to delete an income source', async () => {
  fetchMock.delete('/income/1', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete income source/i));
  });

  expect(fetchMock.calls('/income/1')).toHaveLength(1);
  expect(screen.getByText(/failed to delete income source/i)).toBeInTheDocument();
}, 10000);