import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CustomizationComponent from './feedCustomization';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully customizes feed to show only posts with images.', async () => {
  fetchMock.post('/api/customize', {
    status: 200, body: { message: 'Feed customized' }
  });

  await act(async () => {
    render(<MemoryRouter><CustomizationComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Show Only Images'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Feed customized')).toBeInTheDocument();
}, 10000);

test('Shows error message when customizing feed fails.', async () => {
  fetchMock.post('/api/customize', {
    status: 500, body: { message: 'Failed to customize feed' }
  });

  await act(async () => {
    render(<MemoryRouter><CustomizationComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Show Only Images'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to customize feed')).toBeInTheDocument();
}, 10000);

