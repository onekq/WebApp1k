import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './applyForJobs';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successful job application.', async () => {
  fetchMock.post('/apply', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application Successful')).toBeInTheDocument();
}, 10000);

test('failure job application.', async () => {
  fetchMock.post('/apply', 400);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Apply')).toBeInTheDocument();
}, 10000);

