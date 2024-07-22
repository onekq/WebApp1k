import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import UserProgressExport from './userProgressExport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully exports user progress data', async () => {
  fetchMock.get('/user-progress/export', { status: 200 });

  await act(async () => { render(<MemoryRouter><UserProgressExport /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Export Progress')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export successful')).toBeInTheDocument();
}, 10000);

test('Fails to export user progress data', async () => {
  fetchMock.get('/user-progress/export', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><UserProgressExport /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Export Progress')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export failed')).toBeInTheDocument();
}, 10000);

