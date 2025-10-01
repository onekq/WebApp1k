import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './jobPostLocations_saveJobPostsAsDrafts_viewingCompanyProfiles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Specifying valid locations for job openings successfully', async () => {
  fetchMock.post('/api/job', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'San Francisco, CA' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
}, 10000);

test('Specifying locations failure due to invalid location', async () => {
  fetchMock.post('/api/job', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'InvalidLocation' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Invalid location specified/i)).toBeInTheDocument();
}, 10000);

test('Saving job posts as drafts successfully', async () => {
  fetchMock.post('/api/job/draft', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Save as Draft/i));
  });

  expect(fetchMock.calls('/api/job/draft')).toHaveLength(1);
  expect(screen.getByText(/Job saved as draft successfully!/i)).toBeInTheDocument();
}, 10000);

test('Saving job posts as drafts failure due to network error', async () => {
  fetchMock.post('/api/job/draft', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Save as Draft/i));
  });

  expect(fetchMock.calls('/api/job/draft')).toHaveLength(1);
  expect(screen.getByText(/Failed to save job as draft/i)).toBeInTheDocument();
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
