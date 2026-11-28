@ui
@security
@PORT-037
@critical
Feature: Portfolio Static Security
  """
  Cloudflare Pages serves static assets using public/_headers copied to dist/_headers. A strict CSP disallows inline scripts and allows self-hosted contact and resume JavaScript plus Cloudflare Turnstile for script, frame, and connection use. Pages headers do not apply to Functions; the contact endpoint sets its own API headers. No Cloudflare zone change is part of local implementation.
  """

  Background: User Story
    As a portfolio visitor
    I want browser controls to limit page resources to trusted sources
    So that my information and browsing session are better protected

  Scenario: Static pages restrict browser resource loading
    Given the portfolio has been built for Cloudflare Pages
    When the visitor opens the home, contact, and resume pages
    Then each static response includes the content security policy and baseline browser security headers
    And contact and resume behavior loads from same-origin JavaScript without inline scripts
