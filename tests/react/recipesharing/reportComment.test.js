import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ReportCommentComponent from './reportComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully reports a comment', async () => {
  fetchMock.post('/report-comment', 200);

  await act(async () => { render(<MemoryRouter><ReportCommentComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment reported')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to report a comment', async () => {
  fetchMock.post('/report-comment', 500);

  await act(async () => { render(<MemoryRouter><ReportCommentComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to report comment')).toBeInTheDocument();
}, 10000);

