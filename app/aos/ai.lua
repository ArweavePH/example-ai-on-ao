Llama = require("@sam/Llama-Herder")

Users = Users or {}
Responses = Responses or {}

-- Add a handler for the "Send-Prompt" action
Handlers.add(
    "Send-Prompt", -- The name of the handler
    { Action = "Prompt" }, -- The action this handler responds to 
    function (msg)
        -- Log the incoming message to the console
        print(msg.From .. " sent a message to AI: " .. msg.Data)

        -- Set the number of tokens for the AI response
        -- Tokens in LLaMA are variable-length units of text. As a rough estimate,
        -- 20 tokens will generate about 13-15 English words, but this can vary
        -- significantly based on the complexity and vocabulary of the generated text.
        local outputTokens = '50'

        table.insert(Users, msg.From)
        
        -- Call the Llama AI model to generate a response
        Llama.run(
            -- Pass the user's message as the prompt
            msg.Data,
            -- Specify how many tokens to use for the response
            outputTokens,
            -- Callback function that handles the AI response
            function(generatedText) 
                -- Store the AI's response in the Responses table with the user's address as the key
                table.insert(Responses, { [msg.From] = generatedText })
            end
        )
    end
)

Handlers.add(
    "Get-Response", -- The name of the handler
    { Action = "GetResponse" }, -- The action this handler responds to 
    function (msg)
        msg.reply(Responses[msg.From])
    end
)