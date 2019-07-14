// Generated from WHLSL/Spec/WHLSL.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by WHLSLParser.

function WHLSLVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

WHLSLVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
WHLSLVisitor.prototype.constructor = WHLSLVisitor;

// Visit a parse tree produced by WHLSLParser#file.
WHLSLVisitor.prototype.visitFile = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#topLevelDecl.
WHLSLVisitor.prototype.visitTopLevelDecl = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#semantic.
WHLSLVisitor.prototype.visitSemantic = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#builtInSemantic.
WHLSLVisitor.prototype.visitBuiltInSemantic = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#stageInOutSemantic.
WHLSLVisitor.prototype.visitStageInOutSemantic = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#resourceSemantic.
WHLSLVisitor.prototype.visitResourceSemantic = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#specializationConstantSemantic.
WHLSLVisitor.prototype.visitSpecializationConstantSemantic = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#typeDef.
WHLSLVisitor.prototype.visitTypeDef = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#structDef.
WHLSLVisitor.prototype.visitStructDef = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#structElement.
WHLSLVisitor.prototype.visitStructElement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#enumDef.
WHLSLVisitor.prototype.visitEnumDef = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#enumMember.
WHLSLVisitor.prototype.visitEnumMember = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#numthreadsSemantic.
WHLSLVisitor.prototype.visitNumthreadsSemantic = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#funcDef.
WHLSLVisitor.prototype.visitFuncDef = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#funcDecl.
WHLSLVisitor.prototype.visitFuncDecl = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#parameters.
WHLSLVisitor.prototype.visitParameters = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#parameter.
WHLSLVisitor.prototype.visitParameter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#type.
WHLSLVisitor.prototype.visitType = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#addressSpace.
WHLSLVisitor.prototype.visitAddressSpace = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#typeSuffixAbbreviated.
WHLSLVisitor.prototype.visitTypeSuffixAbbreviated = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#typeSuffixNonAbbreviated.
WHLSLVisitor.prototype.visitTypeSuffixNonAbbreviated = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#typeArguments.
WHLSLVisitor.prototype.visitTypeArguments = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#typeArgument.
WHLSLVisitor.prototype.visitTypeArgument = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#block.
WHLSLVisitor.prototype.visitBlock = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#blockBody.
WHLSLVisitor.prototype.visitBlockBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#stmt.
WHLSLVisitor.prototype.visitStmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#ifStmt.
WHLSLVisitor.prototype.visitIfStmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#switchStmt.
WHLSLVisitor.prototype.visitSwitchStmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#switchCase.
WHLSLVisitor.prototype.visitSwitchCase = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#forStmt.
WHLSLVisitor.prototype.visitForStmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#whileStmt.
WHLSLVisitor.prototype.visitWhileStmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#doStmt.
WHLSLVisitor.prototype.visitDoStmt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#variableDecls.
WHLSLVisitor.prototype.visitVariableDecls = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#variableDecl.
WHLSLVisitor.prototype.visitVariableDecl = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#constexpression.
WHLSLVisitor.prototype.visitConstexpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#effectfulExpr.
WHLSLVisitor.prototype.visitEffectfulExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#effAssignment.
WHLSLVisitor.prototype.visitEffAssignment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#assignOperator.
WHLSLVisitor.prototype.visitAssignOperator = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#effPrefix.
WHLSLVisitor.prototype.visitEffPrefix = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#effSuffix.
WHLSLVisitor.prototype.visitEffSuffix = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#expr.
WHLSLVisitor.prototype.visitExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#possibleTernaryConditional.
WHLSLVisitor.prototype.visitPossibleTernaryConditional = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#possibleLogicalBinop.
WHLSLVisitor.prototype.visitPossibleLogicalBinop = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#logicalBinop.
WHLSLVisitor.prototype.visitLogicalBinop = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#possibleRelationalBinop.
WHLSLVisitor.prototype.visitPossibleRelationalBinop = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#relationalBinop.
WHLSLVisitor.prototype.visitRelationalBinop = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#possibleShift.
WHLSLVisitor.prototype.visitPossibleShift = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#possibleAdd.
WHLSLVisitor.prototype.visitPossibleAdd = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#possibleMult.
WHLSLVisitor.prototype.visitPossibleMult = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#possiblePrefix.
WHLSLVisitor.prototype.visitPossiblePrefix = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#prefixOp.
WHLSLVisitor.prototype.visitPrefixOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#limitedSuffixOperator.
WHLSLVisitor.prototype.visitLimitedSuffixOperator = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#possibleSuffix.
WHLSLVisitor.prototype.visitPossibleSuffix = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#callExpression.
WHLSLVisitor.prototype.visitCallExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#term.
WHLSLVisitor.prototype.visitTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by WHLSLParser#literal.
WHLSLVisitor.prototype.visitLiteral = function(ctx) {
  return this.visitChildren(ctx);
};



exports.WHLSLVisitor = WHLSLVisitor;