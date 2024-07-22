import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Community from './reportAPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully reports an inappropriate post', async () => {
  fetchMock.post('/api/community/report', { status: 200 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button', { name: /report/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post reported successfully')).toBeInTheDocument();
}, 10000);

test('Fails to report an inappropriate post', async () => {
  fetchMock.post('/api/community/report', { status: 500 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button', { name: /report/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to report post')).toBeInTheDocument();
}, 10000);

