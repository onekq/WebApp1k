import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import InteractiveContentComponent from './interactiveContentHandling';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: interactive content loads successfully', async () => {
  fetchMock.get('/api/interactive-content', 200);

  await act(async () => { render(<MemoryRouter><InteractiveContentComponent /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('load-interactive-content')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Interactive content loaded')).toBeInTheDocument();
}, 10000);

test('Failure: interactive content fails to load', async () => {
  fetchMock.get('/api/interactive-content', 500);

  await act(async () => { render(<MemoryRouter><InteractiveContentComponent /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('load-interactive-content')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading interactive content')).toBeInTheDocument();
}, 10000);

