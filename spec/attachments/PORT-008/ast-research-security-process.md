# AST research: security process calls

Command: fspec astgrep --pattern 'spawnSync($CMD, $ARGS, $OPTIONS)' --lang js --path scripts

Observed matches: the dependency audit subprocess and the quality runner's npm script subprocess.

Conclusion: security commands are launched by the shared quality runner, and detailed audit output is stored under test-results for private CI artifact retention.
