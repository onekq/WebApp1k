import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './applicationWithLinkedIn';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successful LinkedIn application.', async () => {
  fetchMock.post('/applyLinkedIn', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-linkedin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('LinkedIn Application Successful')).toBeInTheDocument();
}, 10000);

test('failure LinkedIn application.', async () => {
  fetchMock.post('/applyLinkedIn', 400);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-linkedin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Submit LinkedIn Application')).toBeInTheDocument();
}, 10000);

