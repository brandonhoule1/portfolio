@ui
@quality
@PORT-035
Feature: Protect contact form with Cloudflare Turnstile
  """
  Build-time TURNSTILE_SITE_KEY injects the public widget key into the contact page; TURNSTILE_SECRET_KEY is an encrypted Pages Function secret. Verify each token through Cloudflare Siteverify and require its reported hostname to match the request host before calling Google OAuth or Gmail. Keep the honeypot and generic error handling; fail closed when production keys are unavailable.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. The contact endpoint must require a non-empty Turnstile response and validate it with Cloudflare Siteverify before requesting Gmail delivery; verification fails closed if configuration is missing or invalid.
  #   2. The current honeypot remains active, and the public form explains verification or delivery errors without exposing secrets or provider details.
  #
  # EXAMPLES:
  #   1. A missing, invalid, expired, or wrong-host token is rejected before Google OAuth or Gmail is called; a honeypot submission still receives the generic success response without delivery.
  #   2. A visitor submits a valid contact message after completing the bot check and sees a confirmation when the message is accepted.
  #   3. A visitor who skips or fails the bot check is asked to retry; a bot that completes the hidden decoy field sees a generic confirmation, but no email is sent.
  #
  # ========================================
  Background: User Story
    As a visitor to Brandon's portfolio
    I want to complete a bot check before sending a contact message
    So that automated spam is less likely to reach Brandon's inbox

  Scenario: A verified visitor can send a contact message
    Given The contact form is available and a visitor has completed the bot check
    When the visitor submits valid contact details and a message
    Then the message is sent and the visitor sees a confirmation

  Scenario: An incomplete or invalid bot check blocks contact delivery
    Given the visitor has not completed the bot check or its verification has expired
    When the visitor submits valid contact details and a message
    Then the visitor is asked to complete the bot check and the message is not sent

  Scenario: A honeypot submission does not deliver email
    Given an automated submission has filled the hidden decoy field
    When the submission reaches the contact form
    Then the submission sees a generic confirmation and no email is sent
