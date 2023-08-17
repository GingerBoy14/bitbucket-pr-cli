import {
  REPO_NAME,
  REPO_TOCKEN,
  REPO_WORKSPACE,
  BITBUCKET_API_URL
} from '../constants.js'
import fetch from 'node-fetch'

export const createPullRequest = (data) => {
  const headers = {
    ['Content-Type']: 'application/json',
    ['Accept']: 'application/json',
    Authorization: `Bearer ${REPO_TOCKEN}`
  }

  return fetch(
    `${BITBUCKET_API_URL}/${REPO_WORKSPACE}/${REPO_NAME}/pullrequests`,
    { method: 'POST', headers, body: JSON.stringify(data) }
  ).then((res) => res.json())
}

export const getRepos = () => {
  const headers = {
    ['Content-Type']: 'application/json',
    ['Accept']: 'application/json',
    Authorization: `Bearer ${REPO_TOCKEN}`
  }

  return fetch(`${BITBUCKET_API_URL}/${REPO_WORKSPACE}`, {
    method: 'GET',
    headers
  }).then((res) => res.json())
}
