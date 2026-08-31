import logging

logger = logging.getLogger(__name__)

class CommunicationAgent:
    """
    AGENT 13: Communication Agent
    Responsible for generating clear, explainable, and empathetic messages to the customer
    if a customer-facing action (like a payment link or an email) is selected.
    """
    def __init__(self):
        pass

    def generate_message(self, context: dict, action: str) -> str:
        """
        Draft the message based on the context of the failure.
        """
        if action == "SEND_PAYMENT_LINK":
            return "We noticed your recent payment attempt couldn't be completed. Don't worry, you can securely complete your transaction using this alternate link."
            
        if action == "REQUEST_ALTERNATE_METHOD":
            return "Your bank seems to be experiencing temporary issues with your selected payment method. Please try using a different card or UPI."
            
        return "Your transaction is being processed."
