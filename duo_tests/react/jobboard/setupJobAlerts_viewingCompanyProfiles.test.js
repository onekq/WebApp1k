import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './setupApp_viewingCompanyProfiles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('job seekers can successfully set up alerts for new jobs matching their criteria', async () => {
  fetchMock.post('/api/job/alerts', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Keyword/i), { target: { value: 'React Developer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Alert/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Alert set successfully')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if alert setup fails', async () => {
  fetchMock.post('/api/job/alerts', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Keyword/i), { target: { value: 'React Developer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Alert/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set alert')).toBeInTheDocument();
}, 10000);

test('job seekers can successfully view company profiles', async () => {
  fetchMock.get('/api/company/1', { name: 'TechCorp', bio: 'A tech company' });

  await act(async () => { render(<MemoryRouter><App companyId="1" /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('TechCorp')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if company profile fails to load', async () => {
  fetchMock.get('/api/company/1', 404);

  await act(async () => { render(<MemoryRouter><App companyId="1" /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error loading company profile')).toBeInTheDocument();
}, 10000);