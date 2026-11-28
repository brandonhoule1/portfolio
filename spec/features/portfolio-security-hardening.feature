@critical
@ui
@security
@PORT-037
Feature: Harden contact endpoint security
  """
  The contact Pages Function adds security headers to every response because the static Pages _headers file does not affect Functions. Enforce an exact same-origin Origin and multipart/form-data before parsing, then read at most 12,000 bytes from the request stream. Preserve Turnstile hostname verification, the honeypot, safe errors, and server-side Gmail secret isolation. Cloudflare Free production rate limiting remains an external rollout: path /api/contact, characteristic IP, threshold 5 requests per 10 seconds, block for 10 seconds; Free rules are path-based and apply to all methods. Local implementation does not change the Cloudflare zone.
  """

  Background: User Story
    As a portfolio owner
    I want to protect visitors and contact delivery from common web attacks and abusive submissions
    So that visitors can use the site and contact form without weakening privacy or exposing my email service

  Scenario: Invalid contact requests are rejected before delivery
    Given contact delivery and Turnstile are configured
    When a request has no same-origin Origin, uses another origin or media type, or exceeds the request body limit
    Then the request is rejected before Turnstile, Google OAuth, or Gmail is contacted

  Scenario: A valid contact request remains usable at the body size limit
    Given a visitor submits a valid same-origin multipart message with a completed Turnstile check
    When the request body is exactly 12,000 bytes
    Then the message is delivered through Gmail and the visitor receives a safe confirmation

  Scenario: Contact responses include security headers and safe messages
    Given the contact function returns a success, rejection, honeypot, or configuration response
    When the visitor receives the response
    Then it includes no-store and API security headers without exposing private provider details
