import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import JobPostTemplates from './jobPostTemplates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('employers can successfully use templates for common job posts', async () => {
  fetchMock.get('/api/job/templates', [{ title: 'Software Engineer', description: 'Develop applications' }]);

  await act(async () => { render(<MemoryRouter><JobPostTemplates /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Software Engineer')).toBeInTheDocument();
}, 10000);

test('employers see an error message if job post templates fail to load', async () => {
  fetchMock.get('/api/job/templates', 500);

  await act(async () => { render(<MemoryRouter><JobPostTemplates /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load job post templates')).toBeInTheDocument();
}, 10000);

