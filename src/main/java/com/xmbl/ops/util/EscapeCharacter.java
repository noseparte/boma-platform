package com.xmbl.ops.util;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.StringCharacterIterator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

class EscapeCharacter
{
  private static final Pattern SCRIPT = Pattern.compile("<SCRIPT>", 2);

  private static final Pattern SCRIPT_END = Pattern.compile("</SCRIPT>", 2);

  public static final String escapeHTML(String aText)
  {
    StringBuilder result = new StringBuilder();
    StringCharacterIterator iterator = new StringCharacterIterator(aText);

    char character = iterator.current();
    while (character != 65535) {
      if (character == '<')
        result.append("&lt;");
      else if (character == '>')
        result.append("&gt;");
      else if (character == '&')
        result.append("&amp;");
      else if (character == '"')
        result.append("&quot;");
      else if (character == '\'')
        result.append("&#039;");
      else if (character == '(')
        result.append("&#040;");
      else if (character == ')')
        result.append("&#041;");
      else if (character == '#')
        result.append("&#035;");
      else if (character == '%')
        result.append("&#037;");
      else if (character == ';')
        result.append("&#059;");
      else if (character == '+')
        result.append("&#043;");
      else if (character == '-') {
        result.append("&#045;");
        }else{
          result.append(character);
      }
      character = iterator.next();
    }
    return result.toString();
  }

  public static final String escapeURL(String aURLFragment){
    String result = null;
    try {
      result = URLEncoder.encode(aURLFragment, "UTF-8");
    } catch (UnsupportedEncodingException ex) {
      throw new RuntimeException("UTF-8 not supported", ex);
    }
    return result;
  }

  public static final String escapeXML(String aText){
    StringBuilder result = new StringBuilder();
    StringCharacterIterator iterator = new StringCharacterIterator(aText);

    char character = iterator.current();
    while (character != 65535) {
      if (character == '<')
        result.append("&lt;");
      else if (character == '>')
        result.append("&gt;");
      else if (character == '"')
        result.append("&quot;");
      else if (character == '\'')
        result.append("&#039;");
      else if (character == '&') {
        result.append("&amp;");
        }else{
        result.append(character);
      }
      character = iterator.next();
    }
    return result.toString();
  }

  public static final String escapeTags(String aText){
    StringBuilder result = new StringBuilder();
    StringCharacterIterator iterator = new StringCharacterIterator(aText);

    char character = iterator.current();
    while (character != 65535) {
      if (character == '<')
        result.append("&lt;");
      else if (character == '>') {
        result.append("&gt;");
      }
      else
      {
        result.append(character);
      }
      character = iterator.next();
    }
    return result.toString();
  }

  public static final String escapeRegex(String aRegexFragment)
  {
    StringBuilder result = new StringBuilder();

    StringCharacterIterator iterator = new StringCharacterIterator(aRegexFragment);

    char character = iterator.current();
    while (character != 65535)
    {
      if (character == '.')
        result.append("\\.");
      else if (character == '\\')
        result.append("\\\\");
      else if (character == '?')
        result.append("\\?");
      else if (character == '*')
        result.append("\\*");
      else if (character == '+')
        result.append("\\+");
      else if (character == '&')
        result.append("\\&");
      else if (character == ':')
        result.append("\\:");
      else if (character == '{')
        result.append("\\{");
      else if (character == '}')
        result.append("\\}");
      else if (character == '[')
        result.append("\\[");
      else if (character == ']')
        result.append("\\]");
      else if (character == '(')
        result.append("\\(");
      else if (character == ')')
        result.append("\\)");
      else if (character == '^')
        result.append("\\^");
      else if (character == '$') {
        result.append("\\$");
      }
      else
      {
        result.append(character);
      }
      character = iterator.next();
    }
    return result.toString();
  }

  public static final String escapeQuote(String aInput)
  {
    return Matcher.quoteReplacement(aInput);
  }

  public static final String escapeScriptTags(String aText)
  {
    String result = null;
    Matcher matcher = SCRIPT.matcher(aText);
    result = matcher.replaceAll("&lt;SCRIPT>");
    matcher = SCRIPT_END.matcher(result);
    result = matcher.replaceAll("&lt;/SCRIPT>");
    return result;
  }
}