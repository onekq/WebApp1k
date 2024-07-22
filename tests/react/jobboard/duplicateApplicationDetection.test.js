import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './duplicateApplicationDetection';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successful duplicate application detection.', async () => {
  fetchMock.get('/checkDuplicate/123', { duplicate: false });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-duplicate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No Duplicate Application')).toBeInTheDocument();
}, 10000);

test('failure duplicate application detection.', async () => {
  fetchMock.get('/checkDuplicate/123', { duplicate: true });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-duplicate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Duplicate Application Found')).toBeInTheDocument();
}, 10000);