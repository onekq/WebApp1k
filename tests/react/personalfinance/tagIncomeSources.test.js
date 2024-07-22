import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import AssignTags from './tagIncomeSources';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully assigns tags to an income source', async () => {
  fetchMock.post('/income/1/tags', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><AssignTags incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'Bonus,Part-time' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/assign tags/i));
  });

  expect(fetchMock.calls('/income/1/tags')).toHaveLength(1);
  expect(screen.getByText(/tags assigned successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to assign tags to an income source', async () => {
  fetchMock.post('/income/1/tags', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><AssignTags incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/assign tags/i));
  });

  expect(fetchMock.calls('/income/1/tags')).toHaveLength(1);
  expect(screen.getByText(/failed to assign tags/i)).toBeInTheDocument();
}, 10000);

