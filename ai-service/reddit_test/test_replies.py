from ai.reply_generator import generate_replies

text = "How do you handle being in business with a friend?"

replies = generate_replies(text)

print("Option 1:", replies[0])
print("Option 2:", replies[1])
