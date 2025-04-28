import re

def format_text_to_markdown(text):
    # Remove extra spaces and line breaks from the original text
    text = re.sub(r'\n+', '\n', text.strip())

    # Function to handle sections like Academics, Infrastructure, etc.
    def format_section(section_title, section_content):
        formatted = f"### **{section_title}:**\n"
        formatted += section_content.strip().replace('*', '-').replace('\n', '\n    ')  # Convert bullet points into markdown list
        return formatted
    
    # Helper function for proper indentation and markdown list formatting
    def format_bullet_points(content):
        # Convert '*' or other bullet markers into markdown style lists
        content = re.sub(r'(\* )', '- ', content)
        return content

    # Function to make text bold if it's inside double quotes
    def make_bold_in_quotes(content):
        # Regular expression to find text within double quotes and make it bold
        return re.sub(r'"(.*?)"', r'**\1**', content)
    
    # Split the main body into different sections
    sections = re.split(r'\*\*\s*(.*?)\s*\*\*', text)  # Split by bold titles like '**Academics**'
    
    formatted_text = ""
    
    # We assume that the first part is general introductory text or unformatted, skip it
    for i in range(1, len(sections), 2):
        title = sections[i].strip()
        content = sections[i+1].strip()
        
        # Apply bold formatting for text inside double quotes
        content = make_bold_in_quotes(content)

        if title.lower() == 'academics':
            formatted_text += format_section(title, content)
        elif title.lower() == 'infrastructure':
            formatted_text += format_section(title, content)
        elif title.lower() == 'placements':
            formatted_text += format_section(title, content)
        elif title.lower() == 'faculty':
            formatted_text += format_section(title, content)
        elif title.lower() == 'extracurricular activities':
            formatted_text += format_section(title, content)
        else:
            formatted_text += f"**{title}:**\n{content}\n\n"
    
    return formatted_text


def clean_and_format(text):
    # A utility function to process and clean the input text
    formatted_text = format_text_to_markdown(text)
    return formatted_text


# Sample input text
input_text = """
Francis Xavier Engineering College (FXEC) is a private engineering college located in "Tirunelveli", Tamil Nadu, India. It's affiliated with Anna University and is known for offering undergraduate and postgraduate programs in various engineering disciplines. While specific details like current rankings and placement statistics fluctuate, here's a general overview of what you might expect to find associated with FXEC:

**Academics:**
* FXEC offers a range of engineering branches, typically including but not limited to "computer science", electronics and communication, mechanical, civil, and electrical engineering. The curriculum generally follows Anna University's guidelines.

**Infrastructure:**
* The college usually has its own campus with classrooms, labs, workshops, and "library" facilities. The quality and extent of these facilities can vary.

**Placements:**
* Placement opportunities are a key consideration for students. The success of placement drives depends on many factors, including the overall job market, the college's industry connections, and the students' skills and qualifications. Researching recent placement reports and reviews from past students is crucial for an accurate picture.

**Faculty:**
* The quality of the faculty plays a vital role in the learning experience. Reviews from current and former students can offer insights into this aspect.

**Extracurricular Activities:**
* Many engineering colleges, including FXEC, usually offer opportunities for students to participate in various extracurricular activities, clubs, and events.

**To get a comprehensive understanding of Francis Xavier Engineering College, I strongly recommend:**
* **Visiting their official website:** This is the most reliable source for information about their programs, faculty, facilities, and placement details.
* **Checking online reviews and rankings:** Websites like Shiksha, CollegeDunia, and others may offer student reviews and rankings, but remember to approach these with a critical eye as experiences can be subjective.
* **Connecting with current students or alumni:** Reaching out to current students or alumni through online forums or social media can provide valuable firsthand insights.

In short, FXEC is a college offering engineering education, but the specifics of its quality and suitability for a particular individual depend on various factors requiring further research.
"""

# Format the input text into markdown format
formatted_text = clean_and_format(input_text)

# Print the formatted text
print(formatted_text)
