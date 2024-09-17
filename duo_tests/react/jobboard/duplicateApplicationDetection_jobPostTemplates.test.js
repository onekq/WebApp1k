import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './duplicateApplicationDetection_jobPostTemplates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successful duplicate application detection.', async () => {
  fetchMock.get('/checkDuplicate/123', { duplicate: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-duplicate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No Duplicate Application')).toBeInTheDocument();
}, 10000);

test('failure duplicate application detection.', async () => {
  fetchMock.get('/checkDuplicate/123', { duplicate: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-duplicate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Duplicate Application Found')).toBeInTheDocument();
}, 10000);

test('employers can successfully use templates for common job posts', async () => {
  fetchMock.get('/api/job/templates', [{ title: 'Software Engineer', description: 'Develop applications' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Software Engineer')).toBeInTheDocument();
}, 10000);

test('employers see an error message if job post templates fail to load', async () => {
  fetchMock.get('/api/job/templates', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load job post templates')).toBeInTheDocument();
}, 10000);