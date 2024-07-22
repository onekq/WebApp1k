import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './withdrawJobApplications';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successful withdrawal of job application.', async () => {
  fetchMock.post('/withdraw/123', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('withdraw-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('withdraw-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application Withdrawn Successfully')).toBeInTheDocument();
}, 10000);

test('failure withdrawal of job application.', async () => {
  fetchMock.post('/withdraw/123', 400);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('withdraw-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('withdraw-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Withdraw Application')).toBeInTheDocument();
}, 10000);

