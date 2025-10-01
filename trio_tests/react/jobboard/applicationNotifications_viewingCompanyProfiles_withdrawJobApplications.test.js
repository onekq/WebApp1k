import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applicationNotifications_viewingCompanyProfiles_withdrawJobApplications';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successful application notifications.', async () => {
  fetchMock.get('/notifications', [{ message: 'Application Approved' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application Approved')).toBeInTheDocument();
}, 10000);

test('failure application notifications.', async () => {
  fetchMock.get('/notifications', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Fetch Notifications')).toBeInTheDocument();
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

test('successful withdrawal of job application.', async () => {
  fetchMock.post('/withdraw/123', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('withdraw-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('withdraw-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application Withdrawn Successfully')).toBeInTheDocument();
}, 10000);

test('failure withdrawal of job application.', async () => {
  fetchMock.post('/withdraw/123', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('withdraw-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('withdraw-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Withdraw Application')).toBeInTheDocument();
}, 10000);
