import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Community from './shareUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully shares updates with the community', async () => {
  fetchMock.post('/api/community/share', { status: 200 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('update-input'), { target: { value: 'New update' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Update shared successfully')).toBeInTheDocument();
}, 10000);

test('Fails to share updates without input', async () => {
  fetchMock.post('/api/community/share', { status: 400 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share update')).toBeInTheDocument();
}, 10000);

