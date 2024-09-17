import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './reportAPost_shareUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully reports an inappropriate post', async () => {
  fetchMock.post('/api/community/report', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button', { name: /report/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post reported successfully')).toBeInTheDocument();
}, 10000);

test('Fails to report an inappropriate post', async () => {
  fetchMock.post('/api/community/report', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button', { name: /report/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to report post')).toBeInTheDocument();
}, 10000);

test('Successfully shares updates with the community', async () => {
  fetchMock.post('/api/community/share', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('update-input'), { target: { value: 'New update' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Update shared successfully')).toBeInTheDocument();
}, 10000);

test('Fails to share updates without input', async () => {
  fetchMock.post('/api/community/share', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share update')).toBeInTheDocument();
}, 10000);