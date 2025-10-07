import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addArticle_userReply_autoResponseTemplates_ticketEscalation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds new articles (from addArticle_userReply)', async () => {
  fetchMock.post('path/to/api/article', 201);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('article-input'), { target: { value: 'New Article' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('add-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('fails to add new articles with error message (from addArticle_userReply)', async () => {
  fetchMock.post('path/to/api/article', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('article-input'), { target: { value: 'New Article' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('add-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Allowing users to reply to agent comments should show success message. (from addArticle_userReply)', async () => {
  fetchMock.post('/api/user-reply', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-reply'), { target: { value: 'User reply' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-reply')); });

  expect(fetchMock.calls('/api/user-reply').length).toBe(1);
  expect(screen.getByText('Reply submitted successfully')).toBeInTheDocument();
}, 10000);

test('Allowing users to reply to agent comments should show error message when failed. (from addArticle_userReply)', async () => {
  fetchMock.post('/api/user-reply', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-reply'), { target: { value: 'User reply' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-reply')); });

  expect(fetchMock.calls('/api/user-reply').length).toBe(1);
  expect(screen.getByText('Reply submission failed')).toBeInTheDocument();
}, 10000);

test('Successfully configures auto-response templates. (from autoResponseTemplates_ticketEscalation)', async () => {
  fetchMock.post('/api/saveAutoResponseTemplate', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('templateContent'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Template')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Template saved')).toBeInTheDocument();
}, 10000);

test('Fails to configure auto-response templates. (from autoResponseTemplates_ticketEscalation)', async () => {
  fetchMock.post('/api/saveAutoResponseTemplate', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('templateContent'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Template')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save template')).toBeInTheDocument();
}, 10000);

test('Escalating tickets to higher support levels should show success message. (from autoResponseTemplates_ticketEscalation)', async () => {
  fetchMock.post('/api/escalate-ticket', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('escalation-ticket-id'), { target: { value: 'escalate123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('escalate-ticket')); });

  expect(fetchMock.calls('/api/escalate-ticket').length).toBe(1);
  expect(screen.getByText('Ticket escalated successfully')).toBeInTheDocument();
}, 10000);

test('Escalating tickets to higher support levels should show error message when failed. (from autoResponseTemplates_ticketEscalation)', async () => {
  fetchMock.post('/api/escalate-ticket', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('escalation-ticket-id'), { target: { value: 'escalate123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('escalate-ticket')); });

  expect(fetchMock.calls('/api/escalate-ticket').length).toBe(1);
  expect(screen.getByText('Ticket escalation failed')).toBeInTheDocument();
}, 10000);

