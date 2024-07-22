import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ProfileCompletenessMeter from './profileCompletenessMeter';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('completeness meter displays successfully on job seeker profiles', async () => {
  fetchMock.get('/api/jobseeker/completeness', { completeness: 80 });

  await act(async () => { render(<MemoryRouter><ProfileCompletenessMeter /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile completeness: 80%')).toBeInTheDocument();
}, 10000);

test('completeness meter fails to display on error', async () => {
  fetchMock.get('/api/jobseeker/completeness', 500);

  await act(async () => { render(<MemoryRouter><ProfileCompletenessMeter /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load completeness meter')).toBeInTheDocument();
}, 10000);

